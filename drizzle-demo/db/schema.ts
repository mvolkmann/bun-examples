import {InferInsertModel, InferSelectModel} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const personTable = sqliteTable('person', {
  // The strings passed to the functions below are the column names.
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').notNull()
});

export const todoTable = sqliteTable('todo', {
  id: integer('id').primaryKey({autoIncrement: true}),
  description: text('description').notNull(),
  completed: integer('completed', {mode: 'boolean'}).default(false),
  personId: integer('personId').references(personTable.id)
});

export type Person = InferSelectModel<typeof personTable>;
export type InsertPerson = InferInsertModel<typeof personTable>;

export type Todo = InferSelectModel<typeof todoTable>;
export type InsertTodo = InferInsertModel<typeof todoTable>;
