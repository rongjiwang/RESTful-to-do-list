DROP DATABASE IF EXISTS rongjiwang;
CREATE DATABASE rongjiwang;

\c rongjiwang

CREATE TABLE todo_list (
    id serial primary key,
    job varchar(255),
    description varchar(255),
    is_finished boolean
);

INSERT INTO todo_list values (DEFAULT, 'essayA1', '5pages', false);
INSERT INTO todo_list values (DEFAULT, 'essayA2', '10pages', false);
INSERT INTO todo_list values (DEFAULT, 'essayA3', '20pages', false);
INSERT INTO todo_list values (DEFAULT, 'reportA4', '30pages', true);