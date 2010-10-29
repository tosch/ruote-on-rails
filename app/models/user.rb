
#
# This is a very simple User model, ready to be torn off and replaced by
# another mechanism / library, like for example :
#
#   http://github.com/hassox/warden/
#

require 'bcrypt'


#
# User information is stored in config/passwd
#
#   username:locale:pass_bcrypted:groupa,groupb
#
class User

  attr_reader :name
  attr_reader :locale
  attr_reader :pass
  attr_reader :groups

  def initialize(name, locale, pass, groups)

    @name = name
    @locale = locale
    @pass = pass
    @groups = groups
  end

  def in_group?(group_name)

    @groups.include?(group_name)
  end

  def admin?

    in_group?('admin')
  end

  def self.admin?(name)

    if u = find(name)
      u.admin?
    else
      false
    end
  end

  def self.find(name)

    all.find { |u| u.name == name }
  end

  def self.authentify(user, pass)

    all.each do |u|
      next unless u.name == user
      return u if u.pass == pass
    end

    nil
  end

  def self.all

    fn = Rails.root.join('config', "password.#{Rails.env}")
    fn = File.exist?(fn) ? fn : Rails.root.join(*%w[ config password ])

    lines = File.readlines(fn)

    lines.inject([]) { |a, line|

      line = line.strip

      if line.length > 0 && ( ! line.match(/^#/))

        name, locale, password, groups = line.split(':')
        password = BCrypt::Password.new(password)
        groups = (groups || '').split(',')

        a << User.new(name, locale, password, groups)
      end

      a
    }
  end

  # Returns a list of all the known groups (all the groups mentioned in
  # the passwd file).
  #
  def self.groups

    all.collect { |user| user.groups }.flatten.uniq.sort
  end
end

