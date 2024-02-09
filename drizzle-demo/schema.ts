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

export type Person = InferSelectModel<typeof personTable>;
export type InsertPerson = InferInsertModel<typeof personTable>;

export type Todo = InferSelectModel<typeof todoTable>;
export type InsertTodo = InferInsertModel<typeof todoTable>;

// Relationships must be specified in both directions
// in order to use Drizzle Studio.  If not, the error
// "There is not enough information to infer relation" will be thrown.
export const personRelations = relations(personTable, ({many}) => ({
  todos: many(todoTable)
}));
export const todoRelations = relations(todoTable, ({one}) => ({
  person: one(personTable, {
    fields: [todoTable.personId],
    references: [personTable.id]
  })
}));
