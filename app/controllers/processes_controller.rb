
#
# ruote process instances
#
class ProcessesController < ApplicationController

  def index

    @processes = RuoteKit.engine.processes
  end
end

