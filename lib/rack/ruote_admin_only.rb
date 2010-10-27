
module Rack

  # Only admin users may have access to the /_ruote web console
  #
  class RuoteAdminOnly

    def initialize(app)

      @app = app
    end

    def call(env)

      return @app.call(env) if user_admin?(env)

      pi = env['PATH_INFO']

      if pi.index('/_ruote/javascripts/') || pi.index('/_ruote/images/')
        return @app.call(env)
      end
      if pi.index('/_ruote') || pi.index('/_ruote/')
        return forbidden
      end
      @app.call(env)
    end

    protected

    def user_admin?(env)

      (env['rack.session']['username'] == 'admin')
    end

    def forbidden

      [
        403,
        { 'Content-Type' => 'text/plain', 'Content-Length' => '9' },
        [ 'forbidden' ]
      ]
    end
  end
end

