import {
  trackTimeAndProgress,
  recordClaudeProApplication,
  getLearnerClaudeProStatus,
  listClaudeProApplicants,
  updateApplicantStatus,
} from '../services/claudePro.service.js';

export const postHeartbeat = async (req, res) => {
  try {
    const { courseSlug, seconds } = req.body;
    if (!courseSlug) {
      return res.status(400).json({ message: 'courseSlug is required' });
    }
    const result = await trackTimeAndProgress({
      userId: req.user.id,
      courseSlug,
      seconds: seconds || 30,
    });
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

export const apply = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await recordClaudeProApplication({
      userId: req.user.id,
      courseSlug: slug,
    });
    return res.json({
      ok: true,
      message: 'Applied for Claude Pro for free for 1 month successfully!',
      data: result,
    });
  } catch (err) {
    console.error('Claude Pro apply error:', err);
    return res.status(500).json({ message: 'Failed to submit Claude Pro application' });
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
