
module LoginHelper

  def login_as(username, password=nil)

    visit '/'
    fill_in 'username', :with => username
    fill_in 'password', :with => password || username
    click_button 'login'
  end
end

