require 'sinatra'
require './som'
require './multilayer'
require 'json'



$som = nil
$multilayer = nil

if File.exist?('data/som.bin') then $som = Marshal.load(File.read('data/som.bin')) end
if File.exist?('data/multilayer.bin') then $multilayer = Marshal.load(File.read('data/multilayer.bin')) end

SYMBOLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', "-"]


get '/' do
   File.read(File.join('public', 'index.html')) 
end

get '/trained' do
    return ( $som and $multilayer )
end


post '/train' do
    #print params["data"]
    data = JSON.parse( params["data"] ).map { |niz| niz.flatten } 
    data = data.map { |niz| niz.map { |i| i ? 1.0 : 0.0 } }
   
    puts "som training"
    #print data, "\n"

    $som = SomRecognizer.new data, 12, false
    puts "multilayer training"
    $multilayer = MultilayerRecognizer.new data, 12, false

    puts "training ended"

    File.open('data/som.bin', 'w') {|f| f.write(Marshal.dump($som)) }
    File.open('data/multilayer.bin', 'w') { |f| f.write(Marshal.dump($multilayer)) }

    return "yay"
end





post '/recognize/som' do
    data = params["data"].map { |i| i.to_f }
         
    print "recognizing som" 
    print data, "\n"
    
    if $som == nil then return '0' end
    index = $som.recognize( data )

    #print index, "\n" 
    #print "result x:", node.x," y:",  node.y, "\n"
    
    return SYMBOLS[index] 
end






post '/recognize/multilayer' do
    data = params["data"].map { |i| i.to_f }

    print "recognizing multilayer"
    print data, "\n"

    if $multilayer == nil then return '0' end

    index = $multilayer.recognize data

    return SYMBOLS[index]
end


