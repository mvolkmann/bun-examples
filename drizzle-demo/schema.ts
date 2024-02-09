import {InferInsertModel, InferSelectModel, relations} from 'drizzle-orm';
import {
  index,
  integer,
  sqliteTable,
  text,
  unique
} from 'drizzle-orm/sqlite-core';

export const personTable = sqliteTable(
  'person',
  {
    // The strings passed to the functions below are the column names.
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull()
  },
  table => ({
    name: index('name').on(table.name)
  })
);

export const todoTable = sqliteTable(
  'todo',
  {
    id: integer('id').primaryKey({autoIncrement: true}),
    description: text('description').notNull(),
    completed: integer('completed', {mode: 'boolean'}).default(false),
    personId: integer('personId')
      .notNull()
      .references(() => personTable.id, {
        onDelete: 'cascade'
      })
  },
  table => ({
    descriptionConstraint: unique('description_constraint').on(
      table.description
    )
  })
);

export const personRelations = relations(personTable, ({many}) => ({
  todos: many(todoTable)
}));

export const todoRelations = relations(todoTable, ({one}) => ({
  persons: one(personTable)
}));

export type Person = InferSelectModel<typeof personTable>;
export type InsertPerson = InferInsertModel<typeof personTable>;

export type Todo = InferSelectModel<typeof todoTable>;
export type InsertTodo = InferInsertModel<typeof todoTable>;
