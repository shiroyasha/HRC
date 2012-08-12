
require 'sinatra'
require './test'
require 'json'

r = Recognizer.new

get '/' do
    erb "hello world"
end

post '/' do
    
        data = params["data"]
        
        obrada = data.map { |t| t.to_f }
        #print obrada, "\n"  

        v = r.recognize( obrada )

        puts ' result start ', v
        print obrada, "\n"
        puts ' result end '
        #if v == nil then 
        #    return "not found"
        #else
        #    return v
        #end
        return 4

    #rescue
    #    puts 'Something went wrong'
    #    return nil
    #end
end


