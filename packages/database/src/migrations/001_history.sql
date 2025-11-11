create table history (
    -- unique identifiers
    device_id       text primary key,

    -- data
    progress        jsonb not null,

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz
);

-- triggers
select create_updated_at_trigger ('history');
