
require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')


describe '/_ruote' do

  it 'should not be visible to users not logged in' do

    get '/_ruote'

    response.status.should == 403 # forbidden
  end

  it 'should not be visible to non-admin users' do

    get '/_ruote'

    response.status.should == 403 # forbidden
  end

  it 'should be visible to admin users' do

    login_as('admin')

    get '/_ruote'

    response.status.should == 200
  end
end

