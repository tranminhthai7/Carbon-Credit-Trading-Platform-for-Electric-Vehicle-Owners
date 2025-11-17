# Dev Cleanup Summary

This file documents the archiving/cleanup steps performed to tidy up the repository's dev/test artifacts. These artifacts were backed up into `dev-tools-archived-backup.zip` and the `dev-tools` folder was permanently removed from the repository.

Files archived into `dev-tools-archived-backup.zip` (previously in `dev-tools`):
- `temp/*` (test scripts)
- `dev-tools/mock-auth/*`
- `services/mq-producer/*`
- `services/mq-consumer/*`
- `services/user-service/coverage/*`

Placeholders that were created earlier at the original locations have now been removed from the repository.

Notes:
- I preserved the original files by backing them up to `dev-tools-archived-backup.zip` and then removed the original folders and placeholder files to keep the repository clean.
- Some original files were replaced with placeholders during the archiving process; those placeholders have now been removed, and the originals are preserved in the zip archive.
- I did not delete `dist`, `node_modules`, or other build artifacts which may be actively used by some services. If you want those cleaned up, confirm that no CI or deployment process requires them.

Next steps (suggested):
1. To restore a specific file/folder, extract `dev-tools-archived-backup.zip` and restore the desired files.
2. If you want to permanently delete the archived backup as well, confirm and I will remove the zip file and commit.
3. Optionally, clean up any `dist/` and `node_modules/` that are accidentally tracked in Git (with caution — do not remove them if CI relies on them).

If you want me to continue and fully delete the original files (not just archive), call out which of the archived items to delete permanently.
