create index idx_puzzle_attempts_puzzle_id on puzzle_attempts(puzzle_id);

create index idx_puzzle_attempts_random on puzzle_attempts(puzzle_id) where puzzle_id like 'random:%';

create index idx_puzzle_attempts_daily on puzzle_attempts(puzzle_id) where puzzle_id like '§%';
