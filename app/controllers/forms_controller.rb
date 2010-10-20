
#
# quaderno forms
#
class FormsController < ApplicationController

  def index

    @forms = Form.all
  end

  def new

    @form = Form.new

    @form.task_regex = '/clean the car/'
    @form.template = %{
box fields
  text_input .name "name"
  text_input .age "age"
  text_input .color "colour"
    }.strip
    @form.sample_data = Rufus::Json.encode({
      'fields' => {}
    })

    render :action => 'show'
  end

  def show

    @form = Form.find(params[:id])
  end

  def create

    Form.new(params[:form]).save!

    redirect_to :action => 'index'
  end

  def update

    form = Form.find(params[:id])
    form.attributes = params[:form]
    form.save!

    redirect_to :action => 'index'
  end
end

