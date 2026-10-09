import {
  trackTimeAndProgress,
  getLearnerClaudeProStatus,
  listClaudeProApplicants,
  updateApplicantStatus,
} from '../services/claudePro.service.js';

export const postHeartbeat = async (req, res) => {
  try {
    // Any seconds the client sends are ignored: the service measures the time.
    const { courseSlug } = req.body || {};
    if (!courseSlug || typeof courseSlug !== 'string') {
      return res.status(400).json({ message: 'courseSlug is required' });
    }
    const result = await trackTimeAndProgress({ userId: req.user.id, courseSlug });
    if (!result) return res.status(404).json({ message: 'Enroll in this course first' });
    return res.json({
      ok: true,
      data: {
        timeSpentSeconds: result?.timeSpentSeconds || 0,
        status: result?.status || 'in_progress',
      },
    });
  } catch (err) {
    console.error('Heartbeat error:', err);
    return res.status(500).json({ message: 'Failed to record learning heartbeat' });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { slug } = req.params;
    const status = await getLearnerClaudeProStatus(req.user.id, slug);
    return res.json({ ok: true, data: status });
  } catch (err) {
    console.error('Claude Pro status error:', err);
    return res.status(500).json({ message: 'Failed to retrieve Claude Pro status' });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const { status, courseSlug, sortBy, order, page, limit, search } = req.query;
    const result = await listClaudeProApplicants({
      status: status || 'applied',
      courseSlug,
      sortBy,
      order,
      page,
      limit,
      search,
    });
    return res.json({ ok: true, data: result });
  } catch (err) {
    console.error('Get applicants error:', err);
    return res.status(500).json({ message: 'Failed to load Claude Pro applicants' });
  }
};

export const patchApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const updated = await updateApplicantStatus(id, status);
    return res.json({ ok: true, data: updated });
  } catch (err) {
    console.error('Patch applicant error:', err);
    return res.status(500).json({ message: err.message || 'Failed to update applicant status' });
  }
};
