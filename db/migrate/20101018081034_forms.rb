
class Forms < ActiveRecord::Migration

  def self.up

    create_table :forms do |t|

      t.string :task_regex, :null => false, :unique => true
      t.text :template, :null => false
      t.text :sample_data, :null => false

      t.timestamps
    end
  end

  def self.down

    drop_table :forms
  end
end

