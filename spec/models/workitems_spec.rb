
require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')


describe Ruote::Workitem do

  before(:each) do

    @workitem = Ruote::Workitem.new(
      'fei' => {
        'engineid' => 'engine',
        'wfid' => "201010290-abcd",
        'expid' => '0_0_0' },
      'participant_name' => 'joe',
      'fields' => { 'params' => { 'task' => 'task for joe' } })
  end
end

