import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif text-center mb-8" style={{ color: '#B83C3A' }}>Size Guide</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Saree Blouse Size Chart</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Bust (inches)</th>
                  <th className="border p-2">Waist (inches)</th>
                  <th className="border p-2">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2 text-center">XS (32)</td><td className="border p-2 text-center">32-33</td><td className="border p-2 text-center">26-27</td><td className="border p-2 text-center">14</td></tr>
                <tr><td className="border p-2 text-center">S (34)</td><td className="border p-2 text-center">34-35</td><td className="border p-2 text-center">28-29</td><td className="border p-2 text-center">14.5</td></tr>
                <tr><td className="border p-2 text-center">M (36)</td><td className="border p-2 text-center">36-37</td><td className="border p-2 text-center">30-31</td><td className="border p-2 text-center">15</td></tr>
                <tr><td className="border p-2 text-center">L (38)</td><td className="border p-2 text-center">38-39</td><td className="border p-2 text-center">32-33</td><td className="border p-2 text-center">15.5</td></tr>
                <tr><td className="border p-2 text-center">XL (40)</td><td className="border p-2 text-center">40-41</td><td className="border p-2 text-center">34-35</td><td className="border p-2 text-center">16</td></tr>
                <tr><td className="border p-2 text-center">XXL (42)</td><td className="border p-2 text-center">42-43</td><td className="border p-2 text-center">36-37</td><td className="border p-2 text-center">16.5</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mb-4">Kurti Size Chart</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Bust (inches)</th>
                  <th className="border p-2">Waist (inches)</th>
                  <th className="border p-2">Hip (inches)</th>
                  <th className="border p-2">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2 text-center">XS</td><td className="border p-2 text-center">34</td><td className="border p-2 text-center">28</td><td className="border p-2 text-center">36</td><td className="border p-2 text-center">40</td></tr>
                <tr><td className="border p-2 text-center">S</td><td className="border p-2 text-center">36</td><td className="border p-2 text-center">30</td><td className="border p-2 text-center">38</td><td className="border p-2 text-center">41</td></tr>
                <tr><td className="border p-2 text-center">M</td><td className="border p-2 text-center">38</td><td className="border p-2 text-center">32</td><td className="border p-2 text-center">40</td><td className="border p-2 text-center">42</td></tr>
                <tr><td className="border p-2 text-center">L</td><td className="border p-2 text-center">40</td><td className="border p-2 text-center">34</td><td className="border p-2 text-center">42</td><td className="border p-2 text-center">43</td></tr>
                <tr><td className="border p-2 text-center">XL</td><td className="border p-2 text-center">42</td><td className="border p-2 text-center">36</td><td className="border p-2 text-center">44</td><td className="border p-2 text-center">44</td></tr>
                <tr><td className="border p-2 text-center">XXL</td><td className="border p-2 text-center">44</td><td className="border p-2 text-center">38</td><td className="border p-2 text-center">46</td><td className="border p-2 text-center">45</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to Measure</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Bust:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
              <li><strong>Length:</strong> Measure from shoulder to desired hem length</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
