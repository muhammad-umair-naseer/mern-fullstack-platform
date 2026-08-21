import { findCertificateByCode } from '../services/certificate.service.js';

/** Public certificate verification — deliberately requires no auth. */
export const verifyCertificate = (req, res) => {
  const row = findCertificateByCode(req.params.code);
  if (!row) return res.status(404).json({ message: 'No certificate with that code' });
  res.json({ data: row });
};
