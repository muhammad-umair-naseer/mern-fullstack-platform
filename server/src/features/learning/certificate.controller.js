import { findCertificateByCode } from './certificate.service.js';

/** Public certificate verification — deliberately requires no auth. */
export const verifyCertificate = async (req, res) => {
  try {
    const { data: row, cached } = await findCertificateByCode(req.params.code);
    if (!row) return res.status(404).json({ message: 'No certificate with that code' });
    res.setHeader('X-Cache', cached ? 'HIT' : 'MISS');
    return res.json({ data: row });
  } catch (err) {
    console.error('verifyCertificate error:', err);
    return res.status(500).json({ message: 'Error verifying certificate' });
  }
};
