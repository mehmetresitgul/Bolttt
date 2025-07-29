import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLogin = true;
  bool _loading = false;
  String? _error;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      if (_isLogin) {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
            email: _emailController.text.trim(),
            password: _passwordController.text.trim());
      } else {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
            email: _emailController.text.trim(),
            password: _passwordController.text.trim());
      }
    } on FirebaseAuthException catch (e) {
      setState(() => _error = e.message);
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Card(
          margin: const EdgeInsets.all(16),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(_isLogin ? 'Giriş Yap' : 'Kayıt Ol',
                        style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 24),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(labelText: 'Email'),
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      validator: (v) =>
                          v != null && v.contains('@') ? null : 'Geçersiz email',
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordController,
                      decoration: const InputDecoration(labelText: 'Şifre'),
                      obscureText: true,
                      validator: (v) => v != null && v.length >= 6
                          ? null
                          : 'En az 6 karakter olmalı',
                    ),
                    const SizedBox(height: 24),
                    if (_error != null)
                      Text(_error!,
                          style: const TextStyle(color: Colors.red)),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _submit,
                        child: _loading
                            ? const CircularProgressIndicator()
                            : Text(_isLogin ? 'Giriş Yap' : 'Kayıt Ol'),
                      ),
                    ),
                    TextButton(
                      onPressed: _loading
                          ? null
                          : () => setState(() => _isLogin = !_isLogin),
                      child: Text(_isLogin
                          ? 'Hesabın yok mu? Kayıt ol'
                          : 'Hesabın var mı? Giriş yap'),
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}