-- extensions and trigger helpers
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- generic updated_at trigger function
create or replace function set_updated_at()
    returns trigger as
$$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- helper to attach the updated_at trigger to any table
create or replace function create_updated_at_trigger(tablename regclass)
    returns void as
$$
begin
    execute format(
        'create trigger set_updated_at
        before update
        on %s
        for each row
        when (old is distinct from new)
        execute function set_updated_at();',
        tablename
    );
end;
$$ language plpgsql;
