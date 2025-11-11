create table daily_stats (
    -- unique identifiers
    date            date primary key,

    -- data
    stats           jsonb not null,
    tries           jsonb not null,

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz
);

-- triggers
select create_updated_at_trigger ('daily_stats');

-- indexes for common queries
create index idx_daily_stats_date on daily_stats (date);
create index idx_daily_stats_created_at on daily_stats (created_at);
