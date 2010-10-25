
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

      it 'shows them' do

        login_as('bob')

        get '/workitems'

        response.status.should == 200
      end
    end
  end
end

