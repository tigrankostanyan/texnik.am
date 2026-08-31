import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { MessageSquare, Send, ShieldAlert, Lock, AlertCircle, X } from 'lucide-react';

interface OrderChatDrawerProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderChatDrawer: React.FC<OrderChatDrawerProps> = ({ order, isOpen, onClose }) => {
  const { currentUser, chatMessages, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [errorNotice, setErrorNotice] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = chatMessages[order.id] || [];
  const isOrderLocked = order.status === 'closed' || order.status === 'cancelled';

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setErrorNotice('');

    const res = sendChatMessage(order.id, inputText);
    if (!res.success) {
      setErrorNotice(res.error || 'Հաղորդագրությունն արգելափակվեց');
    } else {
      setInputText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Chat Header */}
        <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-xs text-white flex items-center gap-2">
                Պատվերի Չաթ #{order.orderNumber}
              </div>
              <div className="text-[11px] text-slate-400">
                {currentUser?.role === 'customer' ? order.specialistName || 'Մասնագետ' : order.customerName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Անվտանգության համակարգը ավտոմատ զտում է հեռախոսահամարներն ու արտաքին հղումները:</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Դեռ հաղորդագրություններ չկան: Կարող եք հստակեցնել դետալները տեղում:
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                    {msg.senderName} ({msg.senderRole === 'customer' ? 'Հաճախորդ' : 'Մասնագետ'})
                  </div>
                  <div
                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error notification banner if content moderation failed */}
        {errorNotice && (
          <div className="p-3 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>{errorNotice}</div>
          </div>
        )}

        {/* Locked State or Message Input */}
        {isOrderLocked ? (
          <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            Պատվերը փակված է: Չաթը արգելափակված է:
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Գրեք հաղորդագրություն..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
