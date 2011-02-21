
class Definition < ActiveRecord::Base

  def name

    tree[1]['name'] || tree[1].find { |k, v| v.nil? }.first
  end

  def revision

    tree[1]['revision']
  end

  def tree

    Ruote::Reader.read(definition)
  end

  def tree_json

    Rufus::Json.encode(tree)
  end

  # Makes sure the 'definition' column contains a string that is Ruby code.
  #
  def rubyize!

    self.definition = Ruote::Reader.to_ruby(tree).strip
  end
end

