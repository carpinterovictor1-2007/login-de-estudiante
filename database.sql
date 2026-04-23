-- Tabla de estudiantes para Supabase
create table if not exists estudiantes (
  id serial primary key,
  nombre text not null,
  apellido text not null,
  fecha_nacimiento date not null,
  edad integer, -- Calculado en el frontend o via trigger, pero aquí lo guardamos directo
  email text unique not null,
  telefono text not null,
  direccion text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (opcional si quieres seguridad avanzada, por ahora lo dejamos abierto)
alter table estudiantes enable row level security;

-- Política para permitir inserciones públicas (para pruebas rápidas)
create policy "Permitir inserciones públicas"
on estudiantes for insert
with check (true);

-- Política para permitir lectura pública
create policy "Permitir lectura pública"
on estudiantes for select
using (true);
