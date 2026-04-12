import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Calculator as CalcIcon, RefreshCcw } from 'lucide-react';

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(3000000);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [years, setYears] = useState<number>(30);

  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  const monthlyPayment = 
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <CalcIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">เครื่องคำนวณสินเชื่อ</h2>
              <p className="text-sm text-gray-500">คำนวณยอดผ่อนชำระรายเดือนเบื้องต้น</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setLoanAmount(3000000);
              setInterestRate(3.5);
              setYears(30);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วงเงินกู้ (บาท): <span className="text-blue-600 font-bold ml-2">{formatCurrency(loanAmount)}</span>
              </label>
              <input 
                type="range" 
                min="100000" 
                max="20000000" 
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>100,000</span>
                <span>20,000,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อัตราดอกเบี้ย (% ต่อปี): <span className="text-blue-600 font-bold ml-2">{interestRate}%</span>
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="15" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0.1%</span>
                <span>15%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ระยะเวลาผ่อนชำระ (ปี): <span className="text-blue-600 font-bold ml-2">{years} ปี</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="40" 
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 ปี</span>
                <span>40 ปี</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
            <p className="text-blue-600 font-medium mb-2 uppercase tracking-wider text-sm">ยอดผ่อนชำระต่อเดือน</p>
            <h3 className="text-4xl font-black text-blue-900 mb-6">
              {formatCurrency(Math.round(monthlyPayment))}
            </h3>
            
            <div className="w-full space-y-4 pt-6 border-t border-blue-100">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600/70">เงินต้นทั้งหมด</span>
                <span className="font-bold text-blue-900">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600/70">ดอกเบี้ยทั้งหมด</span>
                <span className="font-bold text-blue-900">{formatCurrency(Math.round(totalInterest))}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-blue-100">
                <span className="text-blue-600 font-bold">ยอดรวมที่ต้องจ่าย</span>
                <span className="font-black text-blue-900">{formatCurrency(Math.round(totalPayment))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex gap-3">
        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">!</div>
        <p className="text-sm text-yellow-800">
          * การคำนวณนี้เป็นการประมาณการเบื้องต้นเท่านั้น อัตราดอกเบี้ยและเงื่อนไขจริงขึ้นอยู่กับแต่ละสถาบันการเงิน
        </p>
      </div>
    </div>
  );
}
