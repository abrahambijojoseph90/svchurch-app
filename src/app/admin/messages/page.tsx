import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Mail, MailOpen, Eye } from "lucide-react";

async function markAsRead(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.contactSubmission.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/admin/messages");
}

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No messages yet.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <details
                key={msg.id}
                className={`bg-white rounded-lg shadow group ${
                  !msg.read ? "border-l-4 border-[#ab815a]" : ""
                }`}
              >
                <summary className="px-6 py-4 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      {msg.read ? (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-[#ab815a]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-medium ${
                            msg.read ? "text-gray-600" : "text-gray-900"
                          }`}
                        >
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ab815a] text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                    <div className="text-sm text-gray-400 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </summary>
                <div className="px-6 pb-4 border-t border-gray-100 pt-4">
                  {msg.phone && (
                    <p className="text-sm text-gray-500 mb-2">
                      Phone: {msg.phone}
                    </p>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                    {msg.message}
                  </div>
                  {!msg.read && (
                    <form action={markAsRead} className="mt-3">
                      <input type="hidden" name="id" value={msg.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-white font-medium transition-colors"
                        style={{ backgroundColor: "#ab815a" }}
                      >
                        <MailOpen className="w-4 h-4" />
                        Mark as Read
                      </button>
                    </form>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
