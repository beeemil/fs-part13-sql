-- Create blog table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

-- Insert blogs
insert into blogs (author, url, title) values ('Eemil', 'Ruokablogi.com', 'Eemilin ruokablogi');
insert into blogs (author, url, title) values ('Tuuli', 'Puutarhablogi.com', 'Tuulin puutarhablogi');