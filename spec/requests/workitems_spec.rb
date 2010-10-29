
require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')


describe '/workitems' do

  describe '/index' do

    context 'when there are no workitems' do

      it 'shows no workitems' do

        login_as('bob')

        get '/workitems'

        response.status.should == 200
      end
    end

    context 'when there are workitems' do

      before(:each) do

        %w[ alice bob ].each_with_index do |pname, i|

          RuoteKit.storage_participant.update(Ruote::Workitem.new(
            'fei' => {
              'engineid' => 'engine',
              'wfid' => "20101029#{i}-abcd",
              'expid' => '0_0_0' },
            'participant_name' => pname,
            'fields' => { 'params' => { 'task' => "task for #{pname}" } }))
        end
      end

      after(:each) do

        RuoteKit.engine.storage.purge!
      end

      it 'shows them' do

        login_as('bob')

        get '/workitems'

        response.status.should == 200
        response.should_not contain('for alice')
        response.should contain('for bob')
      end

      it 'shows all the workitems to admins' do

        login_as('admin')

        get '/workitems'

        response.status.should == 200
        response.should contain('for alice')
        response.should contain('for bob')
      end
    end
  end
end

