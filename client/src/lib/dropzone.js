/**
 * Drag-and-drop for a click-to-choose zone. Spread onto the element:
 *   <div {...dropHandlers(handleSelectFile)} onClick={...}>
 * Several tools said "Drop file here" while only wiring onClick; this makes
 * the label true without each one re-implementing the two handlers.
 */
export const dropHandlers = (onFile, { multiple = false } = {}) => ({
  onDragOver: (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  },
  onDrop: (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    if (multiple) onFile(files);
    else onFile(files[0]);
  },
});
