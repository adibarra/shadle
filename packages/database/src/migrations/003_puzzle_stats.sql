create table puzzle_stats (
    -- unique identifiers
    puzzle_id       text primary key,

    -- data
    stats           jsonb not null,

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz
);

-- triggers
select create_updated_at_trigger ('puzzle_stats');
