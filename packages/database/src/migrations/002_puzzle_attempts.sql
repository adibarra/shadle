create table puzzle_attempts (
    -- unique identifiers
    player_id       text not null,
    puzzle_id       text not null,

    -- data
    tries           integer not null,
    completed       boolean not null default false,
    timestamp       timestamptz not null default now(),

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz,

    -- constraints
    primary key (player_id, puzzle_id)
);

-- triggers
select create_updated_at_trigger ('puzzle_attempts');
