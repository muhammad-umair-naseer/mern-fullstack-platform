import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError


def load(filename):
    spec = importlib.util.spec_from_file_location(filename, Path(__file__).with_name(filename))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


purger = load("cloudflare-purge.py")
installer = load("install-cache-hook.py")
BASE = "https://cortexissolutionhub.com"


class CacheTests(unittest.TestCase):
    def test_allowlist_excludes_private_dynamic_and_foreign_urls(self):
        for url in [BASE + "/api/admin/test.js", BASE + "/login", BASE + "/.env",
                    "https://admin.cortexissolutionhub.com/js/main.js",
                    "https://sketch.cortexissolutionhub.com/socket.io/socket.io.js",
                    "https://evil.example/img/x.png", "http://cortexissolutionhub.com/cortexis-mark.png"]:
            self.assertFalse(purger.eligible(url), url)
        self.assertTrue(purger.eligible(BASE + "/vendor/standard_fonts/LiberationSans-Regular.ttf"))

    def test_changed_deleted_new_and_rollback_urls(self):
        old = {"unchanged": "a", "changed": "b", "deleted": "c"}
        new = {"unchanged": "a", "changed": "d", "new": "e"}
        self.assertEqual(purger.changed_urls(old, new), ["changed", "deleted", "new"])
        self.assertEqual(purger.changed_urls(new, old), ["changed", "deleted", "new"])

    def test_manifest_discovers_query_variants_without_foreign_or_private_urls(self):
        result = purger.manifest(purger.DOMAIN, {
            "files": {"/favicon.ico": "abc", "/api/a.js": "secret"},
            "refs": [["/index.html", "/favicon.ico?v=2"],
                     ["/index.html", "https://evil.example/favicon.ico?v=2"],
                     ["/index.html", "/favicon.ico?v=3#top"]]})
        self.assertEqual(set(result), {BASE + "/favicon.ico", BASE + "/favicon.ico?v=2",
                                      BASE + "/favicon.ico?v=3"})

    def test_real_node_collector_hashes_files_and_finds_queries(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "favicon.ico").write_bytes(b"icon")
            (root / "index.html").write_text('<link href="/favicon.ico?v=2">')
            result = subprocess.run(["node", "-e", purger.COLLECT,
                                     json.dumps([[str(root), "/"]])],
                                    capture_output=True, check=True)
            data = json.loads(result.stdout)
            self.assertEqual(data["files"]["/favicon.ico"], purger.hashlib.sha256(b"icon").hexdigest())
            self.assertIn(["/index.html", "/favicon.ico?v=2"], data["refs"])

    def test_query_scanner_rejects_live_dry_run_code_fragments(self):
        fragments = ["?", r"?:,\s*([\d.]+", r"?!\/\/", r"?:=\s*([^,;]+",
                     "?UA[3]:UA[1],version:mode||parseFloat(UA[1]===",
                     "/assets/test.js?", "/assets/test.js?${version}"]
        result = purger.manifest(purger.DOMAIN, {
            "files": {"/assets/test.js": "abc"},
            "refs": [["/assets/test.js", ref] for ref in fragments] +
                    [["/index.html", "/assets/test.js?v=2&lang=en"]]})
        self.assertEqual(set(result), {BASE + "/assets/test.js",
                                      BASE + "/assets/test.js?v=2&lang=en"})

    def test_api_batches_only_files_and_retries_429(self):
        urls = [BASE + "/assets/x%d.js" % i for i in range(101)]
        requests = []

        class FakeOpener:
            def open(self, req, **kwargs):
                requests.append(json.loads(req.data))
                if len(requests) == 1:
                    raise HTTPError(req.full_url, 429, "rate limit", {}, None)
                return io.BytesIO(b'{"success":true}')

        with patch.object(purger, "build_opener", return_value=FakeOpener()), patch.object(purger.time, "sleep"):
            purger.purge(urls, "a" * 32, "dummy-test-token")
        self.assertEqual([len(r["files"]) for r in requests], [100, 100, 1])
        self.assertTrue(all(set(r) == {"files"} for r in requests))

    def test_api_failure_is_not_reported_as_success(self):
        class FakeOpener:
            def open(self, *args, **kwargs):
                return io.BytesIO(b'{"success":false}')
        with patch.object(purger, "build_opener", return_value=FakeOpener()):
            with self.assertRaisesRegex(RuntimeError, "rejected"):
                purger.purge([BASE + "/favicon.ico"], "a" * 32, "dummy-test-token")

    def test_hit_is_not_enough_if_bytes_are_stale(self):
        with patch.object(purger, "fetch_content", return_value=(b"200", "old-hash")), \
                patch.object(purger.time, "sleep"):
            with self.assertRaisesRegex(RuntimeError, "verification failed"):
                purger.verify([BASE + "/favicon.ico"], {BASE + "/favicon.ico": "new-hash"})

    def test_deleted_asset_checks_origin_fallback(self):
        with patch.object(purger, "fetch_content", side_effect=[(b"200", "html"), (b"200", "html")]) as fetch:
            purger.verify([BASE + "/assets/deleted.js"], {})
        self.assertIn("127.0.0.1:5000", fetch.call_args_list[0].args[0])

    def test_hook_only_after_readiness_and_idempotent(self):
        source = '  if curl -fsS -o /dev/null http://127.0.0.1:5000/ready; then\n' + installer.MARKER + '    exit 0\n  fi\n'
        output = installer.patched(source)
        self.assertEqual(installer.patched(output), output)
        self.assertLess(output.index("/ready; then"), output.index("cloudflare-purge.py"))
        self.assertLess(output.index("cloudflare-purge.py"), output.index("Website is ready."))
        self.assertIn("exit 2", output)
        with self.assertRaises(RuntimeError):
            installer.patched('echo "different deploy script"\n')


if __name__ == "__main__":
    unittest.main()
