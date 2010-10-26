
class Definition < ActiveRecord::Migration

  def self.up

    create_table :definitions do |t|

      t.text :definition, :null => false

      t.timestamps
    end
  end

  def self.down

    drop_table :definitions
  end
end

