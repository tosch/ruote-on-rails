
require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')


describe '/workitems' do

  describe '/index' do

    describe 'when there are no workitems' do

      it 'shows no workitems' do

        login_as('bob')

        get '/workitems'

        response.status.should == 200
      end
    end
  end
end

