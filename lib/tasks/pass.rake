
namespace :pass do

  require 'bcrypt'

  desc %{
    crypts the password given as last arg
  }
  task :crypt do

    pass = ARGV.last

    puts
    puts BCrypt::Password.create(pass)
    puts

    exit 0
  end
end

