create table custom_puzzles (
    -- unique identifiers
    id              text primary key,

    -- data
    answer          text not null,

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz
);

-- triggers
select create_updated_at_trigger ('custom_puzzles');
