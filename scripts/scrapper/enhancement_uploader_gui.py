import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import json
import os
import re
import time
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import threading

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL or key not found in environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

class EnhancementUploaderGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Recipe Enhancement Uploader")
        self.root.geometry("900x700")
        self.root.resizable(True, True)
        
        # Set up the main frame
        main_frame = ttk.Frame(root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # File selection
        file_frame = ttk.LabelFrame(main_frame, text="JSON File Selection", padding="10")
        file_frame.pack(fill=tk.X, pady=5)
        
        self.file_path_var = tk.StringVar()
        self.file_path_var.set(r"c:\Users\WDAGUtilityAccount\Desktop\pantrypal-ai\scripts\scrapper\crispy_buttermilk_fried_chicken_enhancements.json")
        
        ttk.Label(file_frame, text="JSON File Path:").grid(row=0, column=0, sticky=tk.W, pady=5)
        ttk.Entry(file_frame, textvariable=self.file_path_var, width=70).grid(row=0, column=1, padx=5, pady=5, sticky=tk.W)
        ttk.Button(file_frame, text="Browse", command=self.browse_file).grid(row=0, column=2, padx=5, pady=5)
        ttk.Button(file_frame, text="Load", command=self.load_json).grid(row=0, column=3, padx=5, pady=5)
        
        # Recipe info frame
        recipe_frame = ttk.LabelFrame(main_frame, text="Recipe Information", padding="10")
        recipe_frame.pack(fill=tk.X, pady=5)
        
        self.recipe_id_var = tk.StringVar()
        self.recipe_title_var = tk.StringVar()
        self.source_url_var = tk.StringVar()
        
        ttk.Label(recipe_frame, text="Recipe ID:").grid(row=0, column=0, sticky=tk.W, pady=5)
        ttk.Entry(recipe_frame, textvariable=self.recipe_id_var, width=20).grid(row=0, column=1, padx=5, pady=5, sticky=tk.W)
        
        ttk.Label(recipe_frame, text="Recipe Title:").grid(row=1, column=0, sticky=tk.W, pady=5)
        ttk.Entry(recipe_frame, textvariable=self.recipe_title_var, width=70).grid(row=1, column=1, columnspan=3, padx=5, pady=5, sticky=tk.W)
        
        ttk.Label(recipe_frame, text="Source URL:").grid(row=2, column=0, sticky=tk.W, pady=5)
        ttk.Entry(recipe_frame, textvariable=self.source_url_var, width=70).grid(row=2, column=1, columnspan=3, padx=5, pady=5, sticky=tk.W)
        
        # Enhancements frame
        enhancements_frame = ttk.LabelFrame(main_frame, text="Enhancements", padding="10")
        enhancements_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Create a frame for the enhancement list with scrollbars
        list_frame = ttk.Frame(enhancements_frame)
        list_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Scrollbars
        y_scrollbar = ttk.Scrollbar(list_frame)
        y_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview for enhancements
        self.enhancement_tree = ttk.Treeview(list_frame, columns=("Enhancement"), show="headings", yscrollcommand=y_scrollbar.set)
        self.enhancement_tree.heading("Enhancement", text="Enhancement")
        self.enhancement_tree.column("Enhancement", width=800)
        self.enhancement_tree.pack(fill=tk.BOTH, expand=True)
        
        y_scrollbar.config(command=self.enhancement_tree.yview)
        
        # No enhancement type selection needed anymore
        
        # Action buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=10)
        
        ttk.Button(button_frame, text="Upload to Database", command=self.upload_to_database).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Clear All", command=self.clear_all).pack(side=tk.LEFT, padx=5)
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = ttk.Label(root, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Load the default file if it exists
        if os.path.exists(self.file_path_var.get()):
            self.load_json()
    
    def browse_file(self):
        file_path = filedialog.askopenfilename(
            title="Select JSON File",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if file_path:
            self.file_path_var.set(file_path)
    
    def load_json(self):
        file_path = self.file_path_var.get()
        if not file_path or not os.path.exists(file_path):
            messagebox.showerror("Error", "File not found")
            return
        
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Update recipe info
            self.recipe_id_var.set(data.get('recipe_id', ''))
            self.recipe_title_var.set(data.get('recipe_title', ''))
            self.source_url_var.set(data.get('source_url', ''))
            
            # Clear existing items
            for item in self.enhancement_tree.get_children():
                self.enhancement_tree.delete(item)
            
            # Add enhancements to the tree
            for enhancement in data.get('enhancements', []):
                self.enhancement_tree.insert('', 'end', values=(enhancement,))
            
            self.status_var.set(f"Loaded {len(data.get('enhancements', []))} enhancements from {os.path.basename(file_path)}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load JSON: {str(e)}")
    
    # Removed categorize_enhancement method as it's no longer needed
    
    # Removed apply_type method as it's no longer needed
    
    def clear_all(self):
        self.recipe_id_var.set('')
        self.recipe_title_var.set('')
        self.source_url_var.set('')
        
        for item in self.enhancement_tree.get_children():
            self.enhancement_tree.delete(item)
        
        self.status_var.set("Cleared all data")
    
    def upload_to_database(self):
        recipe_id = self.recipe_id_var.get().strip()
        source_url = self.source_url_var.get().strip()
        
        if not recipe_id:
            messagebox.showerror("Error", "Recipe ID is required")
            return
        
        enhancements = []
        for item in self.enhancement_tree.get_children():
            values = self.enhancement_tree.item(item, 'values')
            enhancement_text = values[0]
            # Use a default type for all enhancements
            enhancements.append({
                'text': enhancement_text,
                'type': 'general'
            })
        
        if not enhancements:
            messagebox.showerror("Error", "No enhancements to upload")
            return
        
        # Confirm upload
        if not messagebox.askyesno("Confirm Upload", f"Upload {len(enhancements)} enhancements for recipe {recipe_id}?"):
            return
        
        # Start upload in a separate thread to avoid freezing the UI
        threading.Thread(target=self._upload_thread, args=(recipe_id, source_url, enhancements)).start()
    
    def _upload_thread(self, recipe_id, source_url, enhancements):
        self.status_var.set("Uploading to database...")
        self.root.update_idletasks()
        
        try:
            # First, store in the scraped_enhancements table for backward compatibility
            enhancement_texts = [e['text'] for e in enhancements]
            scraped_data = {
                'recipe_id': recipe_id,
                'enhancements': enhancement_texts,
                'source': source_url,
                'scraped_at': datetime.now().isoformat()
            }
            
            response = supabase.table('scraped_enhancements').upsert(scraped_data).execute()
            
            # Then, store each enhancement individually in the unique_scraped_enhancements table
            success_count = 0
            error_count = 0
            
            for enhancement in enhancements:
                try:
                    unique_data = {
                        'recipe_id': recipe_id,
                        'enhancement': enhancement['text'],
                        'enhancement_type': enhancement['type'],
                        'source': source_url
                    }
                    
                    response = supabase.table('unique_scraped_enhancements').upsert(unique_data).execute()
                    success_count += 1
                except Exception as e:
                    print(f"Error uploading enhancement: {str(e)}")
                    error_count += 1
            
            self.status_var.set(f"Upload complete: {success_count} successful, {error_count} failed")
            messagebox.showinfo("Upload Complete", f"Successfully uploaded {success_count} enhancements to the database.\n{error_count} enhancements failed to upload.")
        
        except Exception as e:
            self.status_var.set(f"Upload failed: {str(e)}")
            messagebox.showerror("Upload Failed", f"Error: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = EnhancementUploaderGUI(root)
    root.mainloop()
