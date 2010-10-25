
module Rack

  # Only admin users may have access to the /_ruote web console
  #
  class RuoteAdminOnly

    def initialize(app)
      @app = app
    end

    def call(env)
      if env['PATH_INFO'].match(/\/_ruote/)
        return forbidden unless env['rack.session']['username'] == 'admin'
      end
      @app.call(env)
    end

    protected

    def forbidden
      [
        403,
        { 'Content-Type' => 'text/plain', 'Content-Length' => '9' },
        [ 'forbidden' ]
      ]
    end
  end
end

