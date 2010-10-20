
require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')


describe Form do

  before(:each) do

    Form.destroy_all

    Form.new(
      :task_regex => '/clean car/',
      :template => '',
      :sample_data => '{}'
    ).save!
    Form.new(
      :task_regex => '/bob|sell car/',
      :template => '',
      :sample_data => '{}'
    ).save!
  end

  it 'matches for /task name/' do

    workitem = OpenStruct.new(
      :task => 'clean car', :participant_name => 'alice')

    Form.all[0].match(workitem).should == true
    Form.all[1].match(workitem).should == false
    Form.for(workitem).should == Form.all[0]
  end

  it 'matches for /participant name|task name/' do

    workitem = OpenStruct.new(
      :task => 'sell car', :participant_name => 'bob')

    Form.all[0].match(workitem).should == false
    Form.all[1].match(workitem).should == true
    Form.for(workitem).should == Form.all[1]
  end
end

