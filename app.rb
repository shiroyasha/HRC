
require 'sinatra'
require './test'
require 'json'

r = Recognizer.new

get '/' do
    erb "hello world"
end

post '/' do
    
        data = params["data"].map { |i| i.to_f }
         

        print data, "\n"
        node = r.recognize( data )
        
        print "result x:", node.x," y:",  node.y, "\n"
        return "#{node.x} #{node.y}" 
end


