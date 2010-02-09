# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_ruote-on-rails_session',
  :secret      => '6cb5c20383d83c430e8e211335a03bba9a56976aab39afad989bc28da0a1a2847c6445f588d21aae163781da9ac20481f436eea16df90b9d3cc04242098bceec'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
