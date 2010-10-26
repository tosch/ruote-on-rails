
#
# process definitions
#
class DefinitionsController < ApplicationController

  def index

    @definitions = Definition.all
  end

  def new

    @definition = Definition.new
    @definition.definition = %{
Ruote.process_definition 'my first definition' do
  sequence do
    alice
    bob
  end
end
    }

    render :action => 'edit'
  end

  def edit

    @definition = Definition.find(params[:id])
  end

  def show

    @definition = Definition.find(params[:id])
  end

  def create

    definition = Definition.new(params[:definition])
    definition.rubyize!
    definition.save!

    redirect_to :action => 'index'
  end

  def update

    definition = Definition.find(params[:id])
    definition.attributes = params[:definition]
    definition.rubyize!
    definition.save!

    redirect_to :action => 'index'
  end
end

