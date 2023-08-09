-- Deprecate/delete the First Code Review achievement
UPDATE `Achievement`
SET deletedAt = NOW()
WHERE id = 6;
