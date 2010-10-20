
class Form < ActiveRecord::Base

  def match(workitem)

    task = task_regex.index('|') ?
      "#{workitem.participant_name}|#{workitem.task}" :
      workitem.task

    (Regexp.new(task_regex[1..-2]).match(task) != nil)
  end

  def self.for(workitem)

    all.find { |form| form.match(workitem) }
  end
end

