create table puzzle_attempts (
    -- unique identifiers
    device_id       text not null,
    puzzle_date     text not null,  -- YYYY-MM-DD format

    -- data
    tries           integer not null,
    completed       boolean not null default false,
    timestamp       timestamptz not null default now(),

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz

    -- constraints
    primary key (device_id, puzzle_date)
);

-- triggers
select create_updated_at_trigger ('puzzle_attempts');
