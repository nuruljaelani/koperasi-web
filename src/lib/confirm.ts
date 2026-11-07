import { useConfirmStore, type ConfirmOptions } from '@/store/useConfirmStore';

/**
 * Global helper function to trigger an interactive confirmation dialog.
 * Returns a Promise that resolves to `true` if the user confirms, and `false` if cancelled.
 *
 * Example:
 * ```ts
 * const confirmed = await confirmDialog({
 *   title: 'Hapus Data Anggota?',
 *   message: 'Data anggota ini akan dihapus secara permanen.',
 *   confirmText: 'Ya, Hapus',
 *   variant: 'danger',
 * });
 * if (!confirmed) return;
 * ```
 */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().confirm(options);
}
