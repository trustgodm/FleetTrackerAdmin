create table admin((
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);
