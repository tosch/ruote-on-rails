# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key    => '_ruote-on-rails_session',
  :secret => '168d27500f4df5397f9ad60753f3284b8275e10dde0f7c7fb68610cc58dfe60614a525482ec3d040fd53c7e53ee9a0bd084620c10eed494dd2605253ac256bdc'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
