CREATE TABLE users (
	id int auto_increment primary key,
	name varchar(255),
	email varchar(255) unique not null,
	password varchar(255)
);

CREATE TABLE todos (
	id int auto_increment primary key,
	title varchar(255),
	completed boolean default false,
	user_id int not null,
	foreign key (user_id) references users(id) on delete cascade
);

create table shared_todos (
	id int auto_increment primary key,
	todo_id int,
	user_id int,
	shared_with_id int,
	foreign key (todo_id) references todos(id) on delete cascade,
	foreign key (user_id) references users(id) on delete cascade,
	foreign key (shared_with_id) references users(id) on delete cascade
);