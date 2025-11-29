create type platform as enum ('ios', 'android', 'web');

create table push_subscriptions (
    -- unique identifiers
    player_id       text primary key,

    -- data
    platform        platform not null,
    push_sub        jsonb not null,

    -- audit
    created_at      timestamptz not null default now(),
    updated_at      timestamptz
);

-- triggers
select create_updated_at_trigger ('push_subscriptions');
